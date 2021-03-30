package backend.restserver.controller;


import backend.restserver.config.jwt.JwtProperties;
import backend.restserver.config.oauth.provider.GoogleUserInfo;
import backend.restserver.config.oauth.provider.OAuth2UserInfo;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;
import com.auth0.jwt.JWT;

@RestController
@RequiredArgsConstructor
public class JwtCreateController {


    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/oauth/jwt/google")
    public String jwtCreate(@RequestBody Map<String, Object> data) {
        System.out.println("jwtCreate 실행됨");
        System.out.println(data.get("profileObj"));
        OAuth2UserInfo googleUser =
                new GoogleUserInfo((Map<String, Object>)data.get("profileObj"));

        User userEntity =
                userRepository.findByUsername(googleUser.getProvider()+"_"+googleUser.getProviderId());

        if(userEntity == null) {
            User userRequest = User.builder()
                    .username(googleUser.getProvider()+"_"+googleUser.getProviderId())
                    .password(bCryptPasswordEncoder.encode("겟인데어"))
                    .email(googleUser.getEmail())
                    .provider(googleUser.getProvider())
                    .providerId(googleUser.getProviderId())
                    .roles("ROLE_USER")
                    .build();

            userEntity = userRepository.save(userRequest);
        }

        String jwtToken = JWT.create()
                .withSubject(userEntity.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME))
                .withClaim("userPk", userEntity.getUserPk())
                .withClaim("username", userEntity.getUsername())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return jwtToken;
    }

}
