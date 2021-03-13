//package backend.restserver.controller;
//
//import backend.restserver.entity.User;
//import backend.restserver.repository.UserRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import java.util.Optional;
//
//@Controller
//@ResponseBody
//@RequestMapping(value = "/user")
//public class UserController {
//    private final Logger logger = LoggerFactory.getLogger(IndexController.class);
//    private final UserRepository userRepo;
//
//    @Autowired
//    public UserController(UserRepository userRepo) {
//        this.userRepo = userRepo;
//    }
//
//    // POST user info
//    @PostMapping("/create")
//    public User saveUserInfo(@RequestParam String name) {
//        logger.info("save user name : " + name);
//        return userRepo.save(new User(name));
//    }
//}
