package com.cks.billboard.aspect;

import com.cks.billboard.EventLogable;
import com.cks.billboard.util.Strings;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Aspect
@Component
public class ControllerLoggingAspect extends EventLogable {

    Logger logger = Logger.getLogger(this.getClass().getName());

    // Define a pointcut for all methods in classes annotated with @RestController
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {
    }

    // Advice that runs before any method execution in a RestController
    @Before("controllerMethods()")
    public void logBeforeControllerMethod(JoinPoint jPoint) {
//        logger.info(String.format("Entering method: %s.%s() with arguments: %s",
//                jPoint.getSignature().getDeclaringTypeName(),
//                jPoint.getSignature().getName(),
//                jPoint.getArgs()));
//        super.start();
    }

    // Advice that runs around any method execution in a RestController
    @Around("controllerMethods()")
    public Object logAroundControllerMethod(ProceedingJoinPoint jPoint) throws Throwable {
        super.start();
        Object result = null;
        Exception e = null;
        String className = jPoint.getSignature().getDeclaringTypeName();
        if (Strings.notBlank(className)) {
            className = className.substring(className.lastIndexOf(".") + 1);
        }
        className = className + "." + jPoint.getSignature().getName();
        try {
            result = jPoint.proceed(); // Execute the actual controller method
        } catch (Exception ex) {
            e = ex;
        } finally {
            if (e != null) {
                super.eventLog(className, "Error: "+e.getMessage());
            } else {
                super.eventLog(className, "completed");
            }
        }
        if (e != null) throw e;
        return result;
    }
}