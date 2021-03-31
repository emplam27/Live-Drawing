package backend.restserver.controller;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.entity.Room;
import backend.restserver.entity.User;
import backend.restserver.repository.RoomRepository;
import backend.restserver.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@RestController
public class EntityController {
    private final Logger logger = LoggerFactory.getLogger(IndexController.class);
    private final UserRepository userRepo;
    private final RoomRepository roomRepo;



    @Autowired
    public EntityController(UserRepository userRepo, RoomRepository roomRepo) {
        this.userRepo = userRepo;
        this.roomRepo = roomRepo;
    }

//     GET
//     방 리스트 목록 조회
    @GetMapping("/api")
    public @ResponseBody List<Room> showRoomList() {
        logger.info("show room list");

        //!! 여기 나중에 쓸수도있음 (3/31)
//        List<Room> findRoomList = roomRepo.findAll();
//        List<Room> selectRoomList = new ArrayList<>();
//
//
//        for(int i = 0; i < findRoomList.size(); i++) {
//            if(i == 4) break;
//            selectRoomList.add(findRoomList.get(i));
//        }
//        return selectRoomList;
        //!! 여기 나중에 쓸수도있음 (3/31)

        return roomRepo.findAll();
    }



    @GetMapping("/room/entrance")
    @ResponseBody
    public List<User> showUserInfo(@RequestParam String uuid) {
        logger.info("show user list and number!!" + uuid);
//        List<Member> memberList =  new ArrayList<>();

//        List<Member> memberList = memberRepo.findByRoom_RoomPk(roomPk);
        List<Room> newRoom = roomRepo.findByRoomKey(uuid); // 예가 인덱싱 처리가 안되있어서 해줘야 함 (물론 이번서비스에서는 그정도로 속도 저하가 일어날것 같진않지만..)
        Long roomPk = newRoom.get(0).getRoomPk();
        return userRepo.findByRoom_RoomPk(roomPk);
    }

    @PostMapping("/api/room/entrance")
    public String joinRoom(@RequestBody Map<String, Object> roomJson) {
        String uuid = roomJson.get("roomKey").toString();
        Long roomPk = Long.parseLong(roomJson.get("roomPk").toString());
        String username = roomJson.get("username").toString();

        String password = roomJson.get("password").toString();

        if(uuid == null || uuid.length() == 0 || roomPk == 0 ||   // 널 처리
                password == null || password.length() == 0) {
            System.out.println("잘못된 접근 입니다.");
            return "failure";
        } else {
            logger.info(" uuid is : " + uuid);
            Optional<Room> target = roomRepo.findById(roomPk);

            if(target.get().getRoomPassword().equals(password)) {
                System.out.println("패스워드가 일치합니다. 방으로 입장합니다.");
                User user = userRepo.findByUsername((username));
                target.get().add(user);
                return "success";
            } else {
                System.out.println("패스워드가 틀립니다. 다시 입력해 주세요.");
                return "failure";
            }
        }
    }

    // POST create room
    @PostMapping("/api/room")
    public Room createRoom(@RequestBody Map<String, Object> roomJson) {

        logger.info("createRoom enter");

        String roomKeyValue = UUID.randomUUID().toString();
        String roomTitle = roomJson.get("roomTitle").toString();
        String roomPassword = roomJson.get("roomPassword").toString();
        String roomHost = roomJson.get("roomHost").toString();

        User host = userRepo.findByUsername(roomHost);
        Room newRoom = new Room(roomTitle, roomKeyValue, roomPassword, roomHost);
        newRoom.add(host);

        logger.info("create new room");

        return roomRepo.save(newRoom);
    }
}