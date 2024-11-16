export default class Collection<key, value> extends Map<key, value> {
    public find(statement: (value: value) => boolean): value | undefined {
        return [...this.values()].find(statement);
    }
    public map<type>(map: (value: value) => type): type[] {
        return [...this.values()].map(map);
    }
    public some(statement: (value: value) => boolean): boolean {
        return !!this.find(statement);
    }
}