package backend.restserver.config.jwt;

import java.io.IOException;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ResponseBody;


//! 스프링 시큐리티에서 UsernamePasswordAuthenticationFitler가 있음.
//! /login 요청해서 username,password 전송하면 (post)
//! UsernamePasswordAuthenticationFitler 동작을 함 (얘가 로그인을 진행하는 필터임, AuthenticationManger를 통해서 로그인을 진행함)
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private UserRepository userRepo;

    private final AuthenticationManager authenticationManager; //! 얘를 가지고 로그인시도하면됨.

    private final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class.getSimpleName());
    //! Authentication 객체 만들어서 리턴 => 의존 : AuthenticationManager
    //! 인증 요청시에 실행되는 함수 => /login
    //! 즉 /login 요청을 하면 로그인 시도를 위해서 실행되는 함수
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        logger.info("--------------------------------------시작---------------------------------------");
        logger.info("JwtAuthenticationFilter : 로그인 시도중");
        //! request에 있는 email과 password를 파싱해서 자바 Object로 받기
        ObjectMapper om = new ObjectMapper();
        User user = null;
        try {
            logger.info(request.getInputStream().toString());
//            loginRequestDto = om.readValue(request.getInputStream(), LoginRequestDto.class);
            user = om.readValue(request.getInputStream(), User.class);
            logger.info(""+user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        logger.info("JwtAuthenticationFilter : "+user);
        // 유저네임패스워드 토큰 생성
//        System.out.println(user.getUsername());


//        ! 사용자로부터 이메일을 받으면 유저의 이름을 찾아서 그 이름을 토큰화 시켜준다.
//        User newUser = userRepo.findByEmail(user.getEmail());
//        user.setUsername(newUser.getUsername());

        logger.info("JwtAuthenticationFilter : "+user);
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        user.getPassword());
        logger.info("JwtAuthenticationFilter : 토큰생성완료");
        logger.info("-------> " + authenticationToken);
        // authenticate() 함수가 호출 되면 인증 프로바이더가 유저 디테일 서비스의
        // loadUserByUsername(토큰의 첫번째 파라메터) 를 호출하고
        // UserDetails를 리턴받아서 토큰의 두번째 파라메터(credential)과
        // UserDetails(DB값)의 getPassword()함수로 비교해서 동일하면
        // Authentication 객체를 만들어서 필터체인으로 리턴해준다.

        // Tip: 인증 프로바이더의 디폴트 서비스는 UserDetailsService 타입
        // Tip: 인증 프로바이더의 디폴트 암호화 방식은 BCryptPasswordEncoder
        // 결론은 인증 프로바이더에게 알려줄 필요가 없음.
        Authentication authentication =
                authenticationManager.authenticate(authenticationToken);

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        logger.info("Authentication(로그인 완료됨) : "+principalDetails.getUser().getUsername());
        logger.info("--------------------------------------끝---------------------------------------");
        return authentication;
    }

    //! JWT Token 생성해서 response에 담아주기
    @Override
    @ResponseBody
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {

        logger.info("--------------------------------------시작---------------------------------------");
        logger.info("successfulAuthentication 실행됨 : 인증이 완료되었다는 뜻임");
        PrincipalDetails principalDetails = (PrincipalDetails) authResult.getPrincipal();
        logger.info("---------------------------- : " +principalDetails.getUsername());
        String jwtToken = JWT.create()
                .withSubject(principalDetails.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis()+JwtProperties.EXPIRATION_TIME)) //! 토큰 만료시간 100분
                .withClaim("userPk", principalDetails.getUser().getUserPk())
                .withClaim("username", principalDetails.getUser().getUsername())
                .withClaim("email", principalDetails.getUser().getEmail())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));
        logger.info(jwtToken);
        response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX+jwtToken);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(
                "{\"" + "username" + "\":\"" + principalDetails.getUser().getUsername() + "\",\n"
                        +"\"" + "userId" + "\":\"" + principalDetails.getUser().getUserId() + "\",\n"
                         + "\"" + JwtProperties.HEADER_STRING + "\":\"" + JwtProperties.TOKEN_PREFIX+jwtToken + "\"}"
        );
        logger.info("--------------------------------------끝---------------------------------------");
    }
}
