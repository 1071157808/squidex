/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved
 */

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HelpService } from './../services/help.service';

@Component({
    selector: 'sqx-help',
    styleUrls: ['./help.component.scss'],
    templateUrl: './help.component.html'
})
export class HelpComponent {
    public helpSections =
        this.helpService.getHelp(this.route.snapshot.data['helpPage']);

    constructor(
        private readonly helpService: HelpService,
        private readonly route: ActivatedRoute
    ) {
    }
}