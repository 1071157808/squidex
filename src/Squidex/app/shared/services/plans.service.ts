/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import '@app/framework/angular/http/http-extensions';

import {
    AnalyticsService,
    ApiUrlConfig,
    HTTP,
    Version,
    Versioned
} from '@app/framework';

export class PlansDto {
    constructor(
        public readonly currentPlanId: string,
        public readonly planOwner: string,
        public readonly hasPortal: boolean,
        public readonly plans: PlanDto[],
        public readonly version: Version
    ) {
    }
}

export class PlanDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly costs: string,
        public readonly yearlyId: string,
        public readonly yearlyCosts: string,
        public readonly maxApiCalls: number,
        public readonly maxAssetSize: number,
        public readonly maxContributors: number
    ) {
    }
}

export class PlanChangedDto {
    constructor(
        public readonly redirectUri: string
    ) {
    }
}

export class ChangePlanDto {
    constructor(
        public readonly planId: string
    ) {
    }
}

@Injectable()
export class PlansService {
    constructor(
        private readonly http: HttpClient,
        private readonly apiUrl: ApiUrlConfig,
        private readonly analytics: AnalyticsService
    ) {
    }

    public getPlans(appName: string): Observable<PlansDto> {
        const url = this.apiUrl.buildUrl(`api/apps/${appName}/plans`);

        return HTTP.getVersioned<any>(this.http, url)
                .map(response => {
                    const body = response.payload.body;

                    const items: any[] = body.plans;

                    return new PlansDto(
                        body.currentPlanId,
                        body.planOwner,
                        body.hasPortal,
                        items.map(item => {
                            return new PlanDto(
                                item.id,
                                item.name,
                                item.costs,
                                item.yearlyId,
                                item.yearlyCosts,
                                item.maxApiCalls,
                                item.maxAssetSize,
                                item.maxContributors);
                        }),
                        response.version);
                })
                .pretifyError('Failed to load plans. Please reload.');
    }

    public putPlan(appName: string, dto: ChangePlanDto, version: Version): Observable<Versioned<PlanChangedDto>> {
        const url = this.apiUrl.buildUrl(`api/apps/${appName}/plan`);

        return HTTP.putVersioned<any>(this.http, url, dto, version)
                .map(response => {
                    const body = response.payload.body;

                    return new Versioned(response.version, new PlanChangedDto(body.redirectUri));
                })
                .do(() => {
                    this.analytics.trackEvent('Plan', 'Changed', appName);
                })
                .pretifyError('Failed to change plan. Please reload.');
    }
}