package com.cks.billboard.config;

import java.util.logging.Logger;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
//import org.springframework.security.web.SecurityFilterChain;

/**
 * @author CKSmith
 */

//@Configuration
public class SecurityConfig {
	
	Logger logger = Logger.getLogger(this.getClass().getName());

	/*
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.cors(cors -> cors.disable());
		http.headers(header -> header.disable());
		http.csrf(csrf -> csrf.disable());
		logger.info("cors, csrf and headers disabled");

		return http.build();
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers("/css", "/js", "/public", "/assets");
	}
	*/
}
