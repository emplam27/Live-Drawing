package backend.restserver.config.oauth;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.config.oauth.provider.FacebookUserInfo;
import backend.restserver.config.oauth.provider.GoogleUserInfo;
import backend.restserver.config.oauth.provider.NaverUserInfo;
import backend.restserver.config.oauth.provider.OAuth2UserInfo;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepo;
    
    //! 구글로 부터 받은 userRequest 데이터에 대한 후처리 되는 함수
    //! 함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("getClientRegistration : "+userRequest.getClientRegistration()); //! registrationId로 어떤 OAuth로 로그인 했는지 확인가능.
        System.out.println("getAccessToken : "+userRequest.getAccessToken().getTokenValue());

        OAuth2User oauth2User = super.loadUser(userRequest);
        //! 구글로그인 버튼 클릭 -> 구글로그인창 -> 로그인을 완료 -> code를 리턴(OAuth-Client라이브러리 에서받아줌) -> Access Token 요청 -> Access Token을 받음 (여기까지가 유저리퀘스트 정보임)
        //! userRequest 정보 -> loadUser 함수 호출 -> 회원프로필을 구글로 부터 받는다.
//        System.out.println("getAttributes : "+super.loadUser(userRequest).getAttributes());
        System.out.println("getAttributes : "+oauth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;
        if(userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            System.out.println("구글 로그인 요청");
            oAuth2UserInfo = new GoogleUserInfo(oauth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("facebook")) {
            System.out.println("페이스북 로그인 요청");
            oAuth2UserInfo = new FacebookUserInfo(oauth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            System.out.println("네이버 로그인 요청");
            oAuth2UserInfo = new NaverUserInfo((Map)oauth2User.getAttributes().get("response"));
        }else {
            System.out.println("우리는 구글과 페이스북과 네이버만 지원해요 ㅎㅎㅎ");
        }
        String provider = oAuth2UserInfo.getProvider(); // google or facebook
        System.out.println(provider);
        String providerId = oAuth2UserInfo.getProviderId();
        System.out.println(providerId);
        String username = provider + "_" + providerId; // google_sub에 적힌 번호

        String password = bCryptPasswordEncoder.encode("livedrawing");
        String email = oAuth2UserInfo.getEmail();
        String role = "ROLE_USER";

        User userEntity = userRepo.findByUsername(username);

        if (userEntity == null) {
            System.out.println("OAuth 로그인이 최초입니다.");
            userEntity = User.builder()
                    .username(username)
                    .password(password)
                    .email(email)
                    .role(role)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            userRepo.save(userEntity);
        } else {
            System.out.println("로그인을 이미 한 적이 있습니다. 당신은 자동회원가입이 되어있습니다.");
        }

        // 회원가입을 강제로 진행해볼 예정
//        return super.loadUser(userRequest);
        return new PrincipalDetails(userEntity, oauth2User.getAttributes()); //! 이게 authentication 객체안으로 들어간다.
    }

}
