package backend.restserver.config;

import backend.restserver.config.oauth.PrincipalOauth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity //! 스프링 시큐리티 필터가 스프링 필터체인에 등록이 된다.
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true) //! secured 어노테이션 활성화, preAuthorize, postAuthorize 어노테이션 활성화
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private PrincipalOauth2UserService principalOauth2UserService;

    //! 해당 메서드의 리턴되는 오브젝트를 IoC로 등록 해준다. (그러므로 어디서든 쓸 수 있음)
    @Bean
    public BCryptPasswordEncoder encodePwd() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.authorizeRequests()
//                .antMatchers("/user/**").authenticated() //! 인증만 되면 들어갈 수 있는 주소!!
                //! 매니저 접근은 매니저나 어드민의 역할을 가져야만 접근가능
                .antMatchers("/user/manager/**").access("hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
                .antMatchers("/user/admin/**").access("hasRole('ROLE_ADMIN')")
//                .antMatchers("/")
                .antMatchers("/").access("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN') or hasRole('ROLE_MANAGER')")
//                .antMatchers("/user/login-form").hasAnyAuthority("ROLE_USER")
                .anyRequest().permitAll()
                .and()
                .formLogin()
                .loginPage("/user/login-form") //! user, admin, manager의 역할이 아예없는 권한이 없는 친구들은 전부 로그인 페이지로 보냄
                .loginProcessingUrl("/login") //! login 주소가 호출이 되면 시큐리티가 낚아채서 대신 로그인을 진행해줌
                .defaultSuccessUrl("http://localhost:3000/")
                .and()
                .oauth2Login()
                .loginPage("/user/login-form") //! 구글 로그인이 완료된 뒤의 후처리가 필요함.
                .defaultSuccessUrl("http://localhost:3000/")
                //! 1. 코드 받기(인증) 2. 액세스 토큰(권한) 3. 사용자 프로필 정보를 가져오고 4-1. 그 정보를 토대로 회원가입을 자동으로 진행시키기도 함
                //! 4-2. 정보가 모자를경우? -> (이메일, 전화번호, 이름, 아이디) 쇼핑몰 -> (집주소), 백화점몰 ->(vip등급, 일반등급)
                .userInfoEndpoint()
                .userService(principalOauth2UserService); //! Tip: 구글 로그인이 완료되면 코드를 받는게아니라 엑세스 토큰 + 사용자 프로필정보를 한방에 받는다.

    }

}
