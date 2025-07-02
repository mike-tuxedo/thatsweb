class ReactiveStore {
    constructor(initialValues = {}) {
        // Store for reactive values
        this.store = {};
        // Map to track variable references: { varName: Set(nodes) }
        this.references = new Map();
        // Store original templates for each node
        this.templates = new WeakMap();
        // Store attribute templates for each node
        this.attributeTemplates = new WeakMap();
        this.dependencies = new Map();

        this._listeners = {};

        // Initialize store with initial values
        Object.entries(initialValues).forEach(([key, value]) => {
            this.store[key] = value;
        });

        // Create proxy for reactive updates
        const self = this;
        this.rs = new Proxy(this.store, {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                // Track dependencies before updating the value
                self.trackDependencies(prop, value);

                const oldValue = target[prop];
                target[prop] = value;
                self.updateVariable(prop, value);

                self.emit('change', prop, oldValue, value);

                return true;
            }
        });

        // Initial DOM scan
        this.scanDOM(document.body);

        // Return public API
        return {
            store: this,
            rs: this.rs
        };
    }

    // Listener registrieren
    on(event, callback) {
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    // Listener abmelden (optional)
    off(event, callback) {
        if (!this._listeners[event]) return;
        this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    }

    // Event auslösen
    emit(event, ...args) {
        if (!this._listeners[event]) return;
        this._listeners[event].forEach(cb => cb(...args));
    }

    trackDependencies(varName, value) {
        // Clear any existing dependencies where this variable is a dependent
        this.dependencies.forEach((dependents, key) => {
            if (dependents.has(varName)) {
                dependents.delete(varName);
            }
        });

        // If the value is a string with variables, track the dependencies
        if (typeof value === 'string' && value.includes('{')) {
            const varRegex = /\{([^}]+)\}/g;
            let match;
            while ((match = varRegex.exec(value)) !== null) {
                const depVar = match[1].trim();
                // Only track if the dependency exists in the store
                if (depVar in this.store) {
                    if (!this.dependencies.has(depVar)) {
                        this.dependencies.set(depVar, new Set());
                    }
                    this.dependencies.get(depVar).add(varName);

                    // If the dependency is itself a reference, track that too
                    const depValue = this.store[depVar];
                    if (typeof depValue === 'string' && depValue.startsWith('{') && depValue.endsWith('}')) {
                        const nextDep = depValue.slice(1, -1).trim();
                        if (nextDep in this.store && nextDep !== depVar) {
                            if (!this.dependencies.has(nextDep)) {
                                this.dependencies.set(nextDep, new Set());
                            }
                            this.dependencies.get(nextDep).add(varName);
                        }
                    }
                }
            }
        }
    }

    // Scan a node/subtree for reactivity (for dynamic DOM changes)
    reparse(node) {
        // rs-if
        node.querySelectorAll?.('[rs-if]').forEach(el => {
            const varName = el.getAttribute('rs-if').trim();
            if (!this.references.has(varName)) this.references.set(varName, new Set());
            this.references.get(varName).add({ node: el, attribute: 'rs-if' });
        });

        // rs-for
        node.querySelectorAll?.('[rs-for]').forEach(el => {
            const expr = el.getAttribute('rs-for').trim();
            const [, arrName] = expr.match(/in\s+([\w.]+)/) || [];
            if (arrName) {
                if (!this.references.has(arrName)) this.references.set(arrName, new Set());
                this.references.get(arrName).add({ node: el, attribute: 'rs-for' });
            }
        });

        // Variable placeholders in text nodes
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        while (textNode = walker.nextNode()) {
            const matches = [...textNode.textContent.matchAll(/\{(\w+)\}/g)];
            matches.forEach(match => {
                const varName = match[1];
                if (!this.references.has(varName)) this.references.set(varName, new Set());
                this.references.get(varName).add({ node: textNode, attribute: 'text' });
            });
        }

        // Variable placeholders in attributes
        node.querySelectorAll?.('*').forEach(el => {
            for (const attr of el.attributes) {
                const matches = [...attr.value.matchAll(/\{(\w+)\}/g)];
                matches.forEach(match => {
                    const varName = match[1];
                    if (!this.references.has(varName)) this.references.set(varName, new Set());
                    this.references.get(varName).add({ node: el, attribute: attr.name });
                });
            }
        });

        this.scanDOM(node);
    }

    // Scan DOM for variables
    scanDOM(root = document.body) {
        // Process text nodes and attributes
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script and style tags
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                this.processTextNode(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.processElementNode(node);
            }
        }

        // rs-if
        root.querySelectorAll('[rs-if]').forEach(el => {
            const varName = el.getAttribute('rs-if').trim();
            if (!el._rs_if_template) el._rs_if_template = el.outerHTML;
            this.updateIfDirective(el, varName);
            if (!this.references.has(varName)) this.references.set(varName, new Set());
            this.references.get(varName).add({ node: el, attribute: 'rs-if' });
        });

        // rs-for
        root.querySelectorAll('[rs-for]').forEach(el => {
            const expr = el.getAttribute('rs-for').trim();
            // Speichere NUR das innere Template für die Items
            if (!el._rs_for_inner) el._rs_for_inner = el.innerHTML;
            this.updateForDirective(el, expr);
            // Extrahiere Array-Variable
            const [, arrName] = expr.match(/in\s+([\w.]+)/) || [];
            if (arrName) {
                if (!this.references.has(arrName)) this.references.set(arrName, new Set());
                this.references.get(arrName).add({ node: el, attribute: 'rs-for' });
            }
            el.innerHTML = '';
        });

        // Update all variables after scanning
        Object.keys(this.store).forEach(key => {
            this.updateVariable(key, this.store[key]);
        });
    }

    updateIfDirective(el, varName) {
        const show = !!this.rs[varName];

        el.style.transition = 'all 0.4s ease';
        el.style.overflow = 'hidden';
        el.savedHeight = el.savedHeight ? el.savedHeight : el.clientHeight;
        el.style.display = 'inline-block';

        if (show) {
            el.style.height = el.savedHeight + 'px';
        } else {
            el.style.height = el.savedHeight + 'px';
            setTimeout(() => {
                el.style.height = '0px';
            }, 0)
        }
    }

    updateForDirective(el, expr) {
        const [_, itemName, arrName] = expr.match(/^(\w+)\s+in\s+([\w.]+)/) || [];
        if (!itemName || !arrName) return;
        const arr = this.rs[arrName];
        if (!Array.isArray(arr)) return;

        // Speichere das ursprüngliche Template (nur einmal)
        if (!el._rs_for_inner) el._rs_for_inner = el.innerHTML;

        // 1. Entferne alle DOM-Knoten, deren Index nicht mehr existiert
        const existing = Array.from(el.querySelectorAll('[rs-for-index]'));
        existing.forEach(node => {
            const idx = Number(node.getAttribute('rs-for-index'));
            if (arr[idx] === undefined) node.remove();
        });

        // 2. Update oder füge neue Knoten hinzu
        arr.forEach((item, idx) => {
            let node = el.querySelector(`[rs-for-index="${idx}"]`);
            let html = el._rs_for_inner
                .replace(/\{item\.(\w+)\}/g, (m, p1) => item[p1])
                .replace(/\{index\}/g, idx)
                .replace(/\{item\.index\}/g, idx)
                .replace(/\{(\w+)\}/g, (m, v) => this.resolveValue(v));

            if (node) {
                // Nur innerHTML aktualisieren, nicht das ganze Element ersetzen
                node.innerHTML = html.replace(/^[\s\S]*<li[^>]*>|<\/li>[\s\S]*$/g, '');
                node.setAttribute('is-newly-added', 'no');
            } else {
                // Neuen Knoten einfügen
                const temp = document.createElement('div');
                temp.innerHTML = html;

                Array.from(temp.childNodes).forEach(clone => {
                    if (clone.nodeType === 1) {
                        clone.setAttribute('data-rs-for-clone', arrName);
                        clone.setAttribute('rs-for-index', idx);
                        clone.setAttribute('is-newly-added', 'yes');
                    }
                    el.appendChild(clone);
                });
            }
        });
    }

    resolveValue(key, visited = new Set()) {
        // Zyklische Referenzen verhindern
        if (visited.has(key)) return `{${key}}`;
        visited.add(key);

        let value = this.store[key];
        if (typeof value !== 'string') return value;

        // Ersetze alle Platzhalter im Wert rekursiv
        return value.replace(/\{([^}]+)\}/g, (match, varName) => {
            varName = varName.trim();
            if (this.store[varName] !== undefined) {
                return this.resolveValue(varName, new Set(visited));
            }
            return match; // Unbekannte Variable bleibt als Platzhalter stehen
        });
    }

    // Process text node for variables
    processTextNode(node) {
        const text = node.nodeValue;
        if (!text.includes('{')) return;

        const parent = node.parentElement;
        if (!parent) return;

        // Store original template
        if (!this.templates.has(parent)) {
            this.templates.set(parent, parent.innerHTML);
        }

        // Find all variables in text
        const matches = text.match(/\{([^}]+)\}/g) || [];
        matches.forEach(match => {
            const varName = match.slice(1, -1).trim();
            if (varName) {
                this.addReference(varName, parent, 'innerHTML');
            }
        });
    }

    // Process element node attributes for variables
    processElementNode(node) {
        // Process attributes
        Array.from(node.attributes).forEach(attr => {
            if (attr.value.includes('{') && attr.value.includes('}')) {
                // Store attribute template
                if (!this.attributeTemplates.has(node)) {
                    this.attributeTemplates.set(node, new Map());
                }
                const nodeTemplates = this.attributeTemplates.get(node);
                nodeTemplates.set(attr.name, attr.value);

                // Find all variables in attribute
                const matches = attr.value.match(/\{([^}]+)\}/g) || [];
                matches.forEach(match => {
                    const varName = match.slice(1, -1).trim();
                    if (varName) {
                        this.addReference(varName, node, attr.name);
                    }
                });
            }
        });
    }

    // Add reference to a variable
    addReference(varName, node, attribute) {
        if (!this.references.has(varName)) {
            this.references.set(varName, new Set());
        }
        this.references.get(varName).add({ node, attribute });
    }

    // Update all references to a variable
    updateVariable(varName, value, processed = new Set()) {
        // Prevent circular references
        if (processed.has(varName)) return;
        processed.add(varName);

        // If this is a reference to another variable, resolve it
        let resolvedValue = value;
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const refVar = value.slice(1, -1).trim();
            if (refVar in this.store && refVar !== varName) {
                // Track this dependency
                if (!this.dependencies.has(refVar)) {
                    this.dependencies.set(refVar, new Set());
                }
                this.dependencies.get(refVar).add(varName);

                // Recursively resolve the reference
                resolvedValue = this.store[refVar];
                if (typeof resolvedValue === 'string' && resolvedValue.startsWith('{') && resolvedValue.endsWith('}')) {
                    // If it's another reference, resolve it
                    const nextRef = resolvedValue.slice(1, -1).trim();
                    if (nextRef in this.store && nextRef !== varName && nextRef !== refVar) {
                        this.updateVariable(nextRef, this.store[nextRef], new Set(processed));
                    }
                }
            }
        }

        // Update all direct references
        if (this.references.has(varName)) {
            const references = this.references.get(varName);
            references.forEach(({ node, attribute }) => {
                if (attribute === 'rs-if') {
                    this.updateIfDirective(node, varName);
                } else if (attribute === 'rs-for') {
                    // Hole den Ausdruck aus dem Attribut
                    const expr = node.getAttribute('rs-for');
                    this.updateForDirective(node, expr);
                } else if (attribute === 'innerHTML') {
                    this.updateNodeContent(node, varName, value);
                } else {
                    this.updateNodeAttribute(node, attribute, varName, value);
                }
            });
        }

        // Also update any variables that depend on this one
        if (this.dependencies.has(varName)) {
            this.dependencies.get(varName).forEach(dependentVar => {
                if (this.store[dependentVar] !== undefined && !processed.has(dependentVar)) {
                    this.updateVariable(dependentVar, this.store[dependentVar], new Set(processed));
                }
            });
        }
    }


    updateNodeContent(node, varName, value) {
        const template = this.templates.get(node);
        if (!template) return;

        // Get all variable names from the template
        const varRegex = /\{([^}]+)\}/g;
        let match;
        const allVars = new Set();
        while ((match = varRegex.exec(template)) !== null) {
            allVars.add(match[1].trim());
        }

        // Replace all variables in the template until no more placeholders
        let newContent = template;
        let hasPlaceholders;
        let iterations = 0;
        const maxIterations = 10; // Prevent infinite loops

        do {
            hasPlaceholders = false;
            allVars.forEach(v => {
                const resolved = this.resolveValue(v);
                const placeholder = `{${v}}`;
                if (newContent.includes(placeholder)) {
                    newContent = newContent.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), resolved);
                    hasPlaceholders = hasPlaceholders || String(resolved).includes('{');
                }
            });

            // Check if there are still placeholders
            hasPlaceholders = hasPlaceholders && /\{[^}]+\}/.test(newContent);

            if (iterations++ > maxIterations) break;
        } while (hasPlaceholders);

        // Replace any remaining undefined variables with their placeholders
        newContent = newContent.replace(/\{([^}]+)\}/g, (match, v) => {
            return v in this.store ? this.store[v] : match;
        });

        node.innerHTML = newContent;
    }

    // Apply the same changes to updateNodeAttribute
    updateNodeAttribute(node, attrName, varName, value) {
        const nodeTemplates = this.attributeTemplates.get(node);
        if (!nodeTemplates) return;

        const template = nodeTemplates.get(attrName);
        if (!template) return;

        // Get all variable names from the template
        const varRegex = /\{([^}]+)\}/g;
        let match;
        const allVars = new Set();
        while ((match = varRegex.exec(template)) !== null) {
            allVars.add(match[1].trim());
        }

        // Replace all variables in the template until no more placeholders
        let newValue = template;
        let hasPlaceholders;
        let iterations = 0;
        const maxIterations = 10; // Prevent infinite loops

        do {
            hasPlaceholders = false;
            allVars.forEach(v => {
                const resolved = this.sanitize(this.resolveValue(v));
                const placeholder = `{${v}}`;
                if (newValue.includes(placeholder)) {
                    newValue = newValue.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), resolved);
                    hasPlaceholders = hasPlaceholders || String(resolved).includes('{');
                }
            });
            if (iterations++ > maxIterations) break;
        } while (hasPlaceholders);

        // Replace any remaining undefined variables with their placeholders
        newValue = newValue.replace(/\{([^}]+)\}/g, (match, v) => {
            return v in this.store ? this.sanitize(this.store[v]) : match;
        });

        node.setAttribute(attrName, newValue);
    }

    // Add this helper function at the class level
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    }

    // Sanitize variable values before inserting into DOM
    sanitize(value) {
        if (typeof value !== 'string') return value;
        // Remove dangerous tags (script, iframe, object, embed, link, style, meta, base, form)
        value = value.replace(/<(script|iframe|object|embed|link|style|meta|base|form)[^>]*>.*?<\/(script|iframe|object|embed|link|style|meta|base|form)>/gi, '');
        value = value.replace(/<(script|iframe|object|embed|link|style|meta|base|form)[^>]*\/?\s*>/gi, '');
        // Remove SVG with on* attributes
        value = value.replace(/<svg[^>]*on\w+="[^"]*"[^>]*>/gi, '');
        // Remove event handler attributes (onxxx)
        value = value.replace(/\son\w+="[^"]*"/gi, '');
        value = value.replace(/\son\w+='[^']*'/gi, '');
        // Remove javascript: and data: from attributes (href, src, action, style)
        value = value.replace(/(href|src|action|style)\s*=\s*(['"])\s*(javascript:|data:)[^'"]*\2/gi, '$1="#"');
        // Remove base64 images (optional)
        value = value.replace(/src\s*=\s*(['"])data:image\/[^"]*\1/gi, 'src="#"');
        return value;
    }
}