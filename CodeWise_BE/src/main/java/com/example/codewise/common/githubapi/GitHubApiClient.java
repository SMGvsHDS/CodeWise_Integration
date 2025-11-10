package com.example.codewise.common.githubapi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class GitHubApiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.set("X-GitHub-Api-Version", "2022-11-28");
        return headers;
    }

    /** 사용자 이메일 조회 */
    public List<Map<String, Object>> getUserEmails(String accessToken) {
        String url = "https://api.github.com/user/emails";
        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(createHeaders(accessToken)),
                List.class
        );
        return response.getBody();
    }

    /** 사용자 organization 조회 */
    public List<Map<String, Object>> getUserOrgs(String accessToken) {
        String url = "https://api.github.com/user/orgs";
        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(createHeaders(accessToken)),
                List.class
        );
        return response.getBody();
    }

    /** organization의 레포지토리 조회 */
    public List<Map<String, Object>> getOrgRepos(String orgLogin, String accessToken) {
        String url = "https://api.github.com/orgs/" + orgLogin + "/repos";
        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(createHeaders(accessToken)),
                List.class
        );
        return response.getBody();
    }

    /** 사용자 개인 레포 조회 추가 */
    public List<Map<String, Object>> getUserRepos(String accessToken) {
        String url = "https://api.github.com/user/repos";
        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(createHeaders(accessToken)),
                List.class
        );
        return response.getBody();
    }
}
