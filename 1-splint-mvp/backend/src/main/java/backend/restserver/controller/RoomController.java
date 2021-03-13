//package backend.restserver.controller;
//
//import backend.restserver.entity.Room;
//import backend.restserver.entity.User;
//import backend.restserver.repository.RoomRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//import java.util.Random;
//
//@RestController
//@RequestMapping(value = "/room")
//public class RoomController {
//    static int randBound = 100;
//
//    private final Logger logger = LoggerFactory.getLogger(IndexController.class);
//    private final RoomRepository roomRepo;
//
//    @Autowired
//    public RoomController(RoomRepository roomRepo) {
//        this.roomRepo = roomRepo;
//    }
//
//    // POST - create room
//    @PostMapping("/create")
//    public Room createRoom(@RequestBody Map<String, Object> userJson, @RequestParam String title) {
//        logger.info("create room");
//        Random rand = new Random();
//        int keyValue = rand.nextInt(randBound);
//        Long id =  (long)Integer.parseInt(userJson.get("id").toString());
//
//        return roomRepo.save(new Room(title, (long)keyValue, id);
//    }
//}