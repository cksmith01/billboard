package com.cks.billboard;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestClient;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class Application {

	@Value("${le.utah.gov.baseUrl}")
	private String baseUrl;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	RestClient restClient(RestClient.Builder builder) {
		return builder.baseUrl(baseUrl).build();
	}

}