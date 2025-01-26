const fs = require('node:fs');
const path = require('node:path');

class FlowDB {
    constructor(data = { filePath: "database.json" }) {
        this.db_file = path.join(__dirname, data.filePath);
        this.dataMap = new Map();
        this._loadDataSync();
    }

    _loadDataSync() {
        try {
            if (fs.existsSync(this.db_file)) {
                const fileData = fs.readFileSync(this.db_file, 'utf8');
                this.dataMap = new Map(Object.entries(JSON.parse(fileData)));
            } else {
                fs.writeFileSync(this.db_file, "{}", { flag: 'wx' });
            }
        } catch (error) {
            console.error("Error loading data:", error);
            throw error;
        }
    }

    _writeDataSync() {
        try {
            const obj = Object.fromEntries(this.dataMap);
            fs.writeFileSync(this.db_file, JSON.stringify(obj, null, 2));
        } catch (error) {
            console.error("Error writing data:", error);
            throw error;
        }
    }

    set(key, value) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        this.dataMap.set(key, value);
        this._writeDataSync();
    }

    get(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        return this.dataMap.get(key);
    }

    has(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        return this.dataMap.has(key);
    }

    all() {
        return Object.fromEntries(this.dataMap);
    }

    delete(key) {
        if (!key) throw new TypeError(`The key '${key}' is not defined!`);
        this.dataMap.delete(key);
        this._writeDataSync();
    }

    deleteAll() {
        this.dataMap.clear();
        this._writeDataSync();
    }

    push(key, value) {
        let current = this.get(key) || [];
        if (!Array.isArray(current)) throw new TypeError("Value is not an array");
        current.push(value);
        this.set(key, current);
    }

    pull(key, value) {
        let current = this.get(key);
        if (!current) return;
        if (!Array.isArray(current)) throw new TypeError("Value is not an array");
        const newArray = current.filter(item => item !== value);
        this.set(key, newArray);
    }

    add(key, value) {
        if (isNaN(value)) throw new TypeError("The value must be a number!");
        let current = this.get(key) || 0;
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");
        this.set(key, current + value);
    }

    subtract(key, value) {
        if (isNaN(value)) throw new TypeError("The value must be a number!");
        let current = this.get(key) || 0;
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");
        this.set(key, current - value);
    }

    math(key, operator, value) {
        if (!['+', '-', '*', '/', '%'].includes(operator)) throw new TypeError("Invalid operator!");
        if (isNaN(value)) throw new TypeError("The value must be a number!");

        let current = this.get(key) ?? 0;
        if (typeof current !== 'number') throw new TypeError("Existing value is not a number!");

        switch (operator) {
            case '+': current += value; break;
            case '-': current -= value; break;
            case '*': current *= value; break;
            case '/': current /= value; break;
            case '%': current %= value; break;
        }
        this.set(key, current);
    }

    backup(fileName) {
        if (!fileName) throw new TypeError("Filename for backup is not defined!");
        const backupPath = path.join(__dirname, `${fileName}.json`);
        try {
            fs.copyFileSync(this.db_file, backupPath);
        } catch (error) {
            console.error("Error creating backup:", error);
            throw error;
        }
    }

    find(key, value) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(item => item === value);
    }

    findBy(key, property, value) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(item => item && item[property] === value);
    }

    map(key, callback) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].map(callback);
    }

    filter(key, callback) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return [];
        return data[key].filter(callback);
    }

    reduce(key, callback, initialValue) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return initialValue;
        return data[key].reduce(callback, initialValue);
    }

    forEach(key, callback) {
        const data = this.all();
        if (!data[key] || !Array.isArray(data[key])) return;
        data[key].forEach(callback);
    }

    restore(fileName) {
        if (!fileName) throw new TypeError("Filename for restore is not defined!");
        const restorePath = path.join(__dirname, `${fileName}.json`);
        try {
            fs.copyFileSync(restorePath, this.db_file);
            this._loadDataSync(); // Reload data after restore
        } catch (error) {
            console.error("Error restoring from backup:", error);
            throw error;
        }
    }
}

module.exports = { FlowDB };