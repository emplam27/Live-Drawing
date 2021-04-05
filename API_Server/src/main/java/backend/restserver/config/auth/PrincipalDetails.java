package backend.restserver.config.auth;


//* 시큐리티가 /login 주소 요청이 오면 낚아채서 로그인을 진행시킨다.
//* 로그인을 진행이 완료가 되면 시큐리티 session을 만들어 준다. (Security ContextHolder)
//* 시큐리티가 가지고 있는 세션에 들어갈 수 있는 오브젝트가 정해져 있다.
//* 오브젝트 => Authentication타입의 객체여야함.
//* Authentication안에 User정보가 있어야 됨.

//* User 오브젝트 타입은 UserDetails 타입객체다.

//* Security Session 영역이 있는데 여기들어갈 수 있는 객체가 Authentication 객체이다.
//* 그리고 이 Authentication 객체안에 User 정보를 등록할때 UserDetails 타입이여야 한다.
//* 그래서 나중에 꺼내쓸때는 시큐리티 세션에 있는걸 꺼내면 오쏀티케이션 객체가 나온다. 이 안에서 유저디테일즈 객체를 꺼내면
//* 유저 오브젝트에 접근할 수 있다.
//* 여기서 PrincipalDetails를 UserDetails를 임플리멘츠 하니까 프린시펄디테일즈를 오쏀티케이션 객체에 넣을 수 있다.

import backend.restserver.entity.User;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Data
public class PrincipalDetails implements UserDetails, OAuth2User {
    
    private User user; // 콤포지션
    private Map<String, Object> attributes;

    //! 일반 로그인 (생성자)
    public PrincipalDetails(User user) {
        this.user = user;
    }

    //! OAuth 로그인 (생성자)
    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    //! 다시 추가해보자
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        user.getRoleList().forEach(r-> {
            System.out.println("r : " + r);
            authorities.add(()->r);
        });
        return authorities;
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // true 반환 : 너의 계정이 만료됬니? 아니요 <--를 의미
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // true 반환 : 너의 계정이 잠겼니? 아니요 <--를 의미
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // true 반환 : 니 비밀번호 너무 오래사용한거 아니니? 아니요 <--를 의미
    }

    @Override
    public boolean isEnabled() {
        
        // 우리 사이트! 1년동안 회원이 로그인을 안하면? 휴면 계정으로 하기로 함
//        user.getLoginDate(); <-- 이걸 가져와서 : 현재 시간 - 로긴 시간  --> 1년을 초과하면 return false 한다! 근데 지금 이걸 다루진 않을꺼니까 다 true로 해준다!
        return true; // 니 계정 활성화 되있니? 아니요 <-- 를 의미
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() { // 얘는 아마 안쓰는 함수가 될거임
        return null;
//        return attributes.get("sub");
    }

}
