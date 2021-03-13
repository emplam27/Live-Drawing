package backend.restserver.controller;

import backend.restserver.entity.Room;
import backend.restserver.entity.User;
import backend.restserver.repository.RoomRepository;
import backend.restserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
public class EntityController {
    static int randBound = 100;
    private final Logger logger = LoggerFactory.getLogger(IndexController.class);
    private final UserRepository userRepo;
    private final RoomRepository roomRepo;

    @Autowired
    public EntityController(UserRepository userRepo, RoomRepository roomRepo) {
        this.userRepo = userRepo;
        this.roomRepo = roomRepo;
    }

    // POST user info
    @PostMapping("/save")
    public User saveUserInfo(@RequestParam String name) {
        logger.info("save user name : " + name);

        return userRepo.save(new User(name));
    }

    // POST create room
    @PostMapping("/create")
    public Room createRoom(@RequestBody Map<String, Object> userJson, @RequestParam String title) {
        logger.info("create room : " + title);
        Random rand = new Random();
        long keyValue = (long)rand.nextInt(randBound);

        long userId = (long)Integer.parseInt(userJson.get("id").toString());
        User target = userRepo.findById(userId).get();

        logger.info("find user : " + target.getName() + " keyVal : " + keyValue);
        Room newRoom = new Room(title, keyValue, target);

        return roomRepo.save(newRoom);
    }

    // GET get host info
    @GetMapping("/check")
    public void checkHost(@RequestParam Long id) {
        logger.info("check host info");
        logger.info("param id " + id);

        Room target = roomRepo.findById(id).get();
        logger.info(target.getUser().getName());
    }
}
