package backend.restserver.config.auth;

import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


//! 시큐리티 설정에서( loginProcessingUrl"/login")을 걸어놨기때문에
//! login 요청이 오면 자동으로 UserDetailsService 타입으로 IoC되어있는 loadUserByUsername 함수가 실행됨 (규칙임)
@Service
public class PrincipalDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;


    //! 로그인시 유저를 찾게된다면
    //! Userdetails가 리턴되는데 이게 Authentication내부에 들어오게 된다. 그리고 이 Authentication이 시큐리티 session에 들어가게 된다.

    //! 시큐리티 session = Authentication(내부 UserDetails)
    //! 시큐리티 session(내부 Authentication(내부 UserDetails))
    //! 함수 종료시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { //* 여기서 username은 html에서 버튼에서 설정한 파라미터랑 반드시 일치해야 여기로 넘어온다. 조심해라
    //* 만약 쟤를 내가 원하는대로 바꺼주고 싶다면 security 설정에서 .usernameParameter("원하는 변수") 로 설정해주면되는데, 그냥 html이랑 맞춰주자.
        User userEntity = userRepo.findByEmail(email);
//        System.out.println(username);
//        System.out.println(userEntity.getUsername());
        System.out.println(userEntity.getEmail());
        if(userEntity != null) {

            System.out.println("is not null?");
            return new PrincipalDetails(userEntity);
        }
//        System.out.println("is null?");
        return null;
    }
}

