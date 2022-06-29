export namespace main {
	
	export class Config {
	    channels: number;
	    gender: string;
	    rate: number;
	    exit_key: string;
	    port: number;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.channels = source["channels"];
	        this.gender = source["gender"];
	        this.rate = source["rate"];
	        this.exit_key = source["exit_key"];
	        this.port = source["port"];
	    }
	}

}

