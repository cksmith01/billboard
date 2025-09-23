package com.cks.billboard.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;

@Component
public class AuthFilter extends OncePerRequestFilter {
	
	private Logger logger = Logger.getLogger(getClass().getName());

	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
			throws ServletException, IOException {

		logger.info("URI["+req.getRequestURI()+"] -----------------------------------------");

		filterChain.doFilter(req, res);
	}

}
