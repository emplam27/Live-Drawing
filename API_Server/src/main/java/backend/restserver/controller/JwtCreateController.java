package backend.restserver.controller;


//import backend.restserver.config.jwt.JwtAuthorizationFilter;
import backend.restserver.config.jwt.JwtProperties;
import backend.restserver.config.oauth.provider.GoogleUserInfo;
import backend.restserver.config.oauth.provider.OAuth2UserInfo;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.auth0.jwt.JWT;

@RestController
@RequiredArgsConstructor
public class JwtCreateController {
    private final Logger logger = LoggerFactory.getLogger(JwtCreateController.class.getSimpleName());
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/api/oauth/jwt/google")
    public Map<String, Object> jwtCreate(@RequestBody Map<String, Object> data) {
        OAuth2UserInfo googleUser =
                new GoogleUserInfo((Map<String, Object>)data.get("profileObj"));

        User userEntity =
                userRepository.findByUsername(googleUser.getName());

        if(userEntity == null) {
            logger.info("OAuth 로그인이 최초입니다.");
            User userRequest = User.builder()
//                    .username(googleUser.getProvider()+"_"+googleUser.getProviderId())
                    .username(googleUser.getName())
                    .password(bCryptPasswordEncoder.encode("livedrawing"))
                    .email(googleUser.getEmail())
                    .roles("ROLE_USER")
                    .provider(googleUser.getProvider())
                    .providerId(googleUser.getProviderId())
                    .profileImage(googleUser.getProfileImage())
                    .build();
            logger.info("username1 : " + userRequest.getUsername());
            logger.info("username2 : " + googleUser.getName());
            String userIdValue = UUID.randomUUID().toString();
            userRequest.setUserId(userIdValue);
            userEntity = userRepository.save(userRequest);
        } else {
            logger.info("로그인을 이미 한 적이 있습니다. 당신은 자동회원가입이 되어있습니다.");
        }

        String jwtToken = JWT.create()
                .withSubject(userEntity.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME))
//                .withClaim("userPk", userEntity.getUserPk())
                .withClaim("username", userEntity.getUsername())
//                .withClaim("email", userEntity.getEmail())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));
        Map<String, Object> json = new HashMap<String, Object>();
        json.put(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX+jwtToken);
        json.put("userId", userEntity.getUserId());
        return json;
    }
}
