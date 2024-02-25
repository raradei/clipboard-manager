export namespace clipboard {
	
	export class StringData {
	    id: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new StringData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.value = source["value"];
	    }
	}

}

