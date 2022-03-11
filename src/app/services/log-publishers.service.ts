import { Injectable } from '@angular/core';

import { LogPublisher, LogConsole, LogLocalStorage } from "./log-publishers";

@Injectable()
export class LogPublishersService {
    constructor() {
        // Build publishers arrays
        this.buildPublishers();
    }
    
    // Public properties
    publishers: LogPublisher[] = [];
    
    // Build publishers array
    buildPublishers(): void {
        // Create instance of LogConsole Class
        this.publishers.push(new LogConsole());
        // Create instance of LogLocalStorage Class
        this.publishers.push(new LogLocalStorage());
        //TODO can log to web api/DB as well
    }
}
