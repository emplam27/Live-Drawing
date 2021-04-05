package backend.restserver.controller;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController // View를 리턴
public class IndexController {
    private final Logger logger = LoggerFactory.getLogger(IndexController.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //! 테스트 코드
    @GetMapping("/logincheck")
    public @ResponseBody
    Map<String, Object> logincheck(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        if (principalDetails != null) {
            System.out.println(principalDetails.getUser().getUsername());
//            return "redirect:http://localhost:3000";
            System.out.println("여기 맞아?" + principalDetails.getAttributes());
            return principalDetails.getAttributes();
        } else {
            return null;
        }
    }

    @PostMapping("/api/join")
    public String join(@RequestBody User user) {
        user.setRoles("ROLE_USER");
        System.out.println(user);
        String rawPassword = user.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        user.setPassword(encPassword);

        
        //! 여기서 아이디 중복체크 검사해야함
        
        userRepo.save(user);
//        return "redirect:http://localhost:3000/user/login-form";
//        return "redirect: https://jungleroad.shop/user/login-form";
        return "success";
    }
}
