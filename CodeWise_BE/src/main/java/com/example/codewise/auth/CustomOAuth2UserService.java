package com.example.codewise.auth;

import com.example.codewise.auth.github.GitHubUserDataFetcher;
import com.example.codewise.auth.github.GitHubUserProfile;
import com.example.codewise.auth.github.GitHubUserSynchronizationService;
import com.example.codewise.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final GitHubUserDataFetcher gitHubUserDataFetcher;
    private final GitHubUserSynchronizationService gitHubUserSynchronizationService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        String accessToken = userRequest.getAccessToken().getTokenValue();
        log.info("accessToken: {}", accessToken);
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
        log.info("Processing OAuth2 login for GitHub user {}", attributes.get("login"));

        GitHubUserProfile profile = gitHubUserDataFetcher.fetch(accessToken, attributes);
        User user = gitHubUserSynchronizationService.synchronize(accessToken, profile);

        attributes.put("userId", user.getId());
        attributes.put("role", user.getRole().name());

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                attributes,
                "id"
        );
    }
}
