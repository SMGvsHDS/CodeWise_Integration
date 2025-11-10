package com.example.codewise.auth;

import com.example.codewise.auth.jwt.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    @Value("${external.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;
    @Value("${external.frontend.login-success-path:/login/success}")
    private String loginSuccessPath;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();

        log.info("SuccessHandler 호출");
        Number userIdAttr = oauthUser.getAttribute("userId");
        Long userId = userIdAttr != null ? userIdAttr.longValue() : ((Number) oauthUser.getAttribute("id")).longValue();
        String role = oauthUser.getAttribute("role") != null
                ? oauthUser.getAttribute("role").toString()
                : "USER";

        String jwt = jwtUtil.generateToken(userId, role);

        response.sendRedirect(buildRedirectUrl(jwt));
    }

    private String buildRedirectUrl(String token) {
        String normalizedBase = frontendBaseUrl.endsWith("/")
                ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
                : frontendBaseUrl;
        String normalizedPath = loginSuccessPath.startsWith("/")
                ? loginSuccessPath
                : "/" + loginSuccessPath;
        return normalizedBase + normalizedPath + "?token=" + token;
    }
}
