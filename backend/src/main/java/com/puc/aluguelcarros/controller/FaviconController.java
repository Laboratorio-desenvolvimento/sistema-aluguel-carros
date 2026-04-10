package com.puc.aluguelcarros.controller;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Controller("/favicon.ico")
@Secured(SecurityRule.IS_ANONYMOUS)
public class FaviconController {

    @Get
    public HttpResponse<Void> favicon() {
        return HttpResponse.noContent();
    }
}
