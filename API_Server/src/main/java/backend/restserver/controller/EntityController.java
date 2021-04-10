package backend.restserver.controller;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.entity.Room;
import backend.restserver.entity.User;
import backend.restserver.repository.RoomRepository;
import backend.restserver.repository.UserRepository;
import jdk.swing.interop.SwingInterOpUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.nio.file.AccessDeniedException;
import java.util.*;

@RestController
public class EntityController {
    private final Logger logger = LoggerFactory.getLogger(EntityController.class.getSimpleName());
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
    public @ResponseBody List<Map<String, Object>> showRoomList() {
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
        List<Room> newRoomList = roomRepo.findAll();


        List<Map<String, Object>> giveRoomList = new ArrayList<Map<String, Object>>();
//        Map<String, Object> map = new HashMap<String, Object>();

//        ArrayList<Map<String, String>[]> RoomList = new ArrayList<Map<String, String>[]>();

        for (int i = 0 ; i < newRoomList.size(); i++) {
//            RoomList.add("1234");

            if(newRoomList.get(i).isRoomActive()){
                List<User> newUserList = userRepo.findByRoom_RoomPk(newRoomList.get(i).getRoomPk());
                User userHost = userRepo.findByUserId(newRoomList.get(i).getRoomHostId());


                Map<String, Object> map = new HashMap<String, Object>();
                map.put("roomHostname", newRoomList.get(i).getRoomHostname());
                map.put("roomId", newRoomList.get(i).getRoomId());
                map.put("roomTitle", newRoomList.get(i).getRoomTitle());
                //? 프로필 사진, 방마다 유저몇명인지 반환
                map.put("userImage", userHost.getProfileImage());
                map.put("userNumber", newUserList.size());
                giveRoomList.add(map);
            } else {}
        }
        return giveRoomList;
    }



    @GetMapping("/api/room/entrance")
    @ResponseBody
    public List<User> showUserInfo(@RequestParam String uuid) {
        logger.info("show user list and number!!" + uuid);

        List<Room> newRoom = roomRepo.findByRoomId(uuid); // 예가 인덱싱 처리가 안되있어서 해줘야 함 (물론 이번서비스에서는 그정도로 속도 저하가 일어날것 같진않지만..)
        Long roomPk = newRoom.get(0).getRoomPk();
        return userRepo.findByRoom_RoomPk(roomPk);
    }

    @PostMapping("/api/room/entrance")
    public String joinRoom(@RequestBody Map<String, Object> roomJson) {
        String roomId = roomJson.get("roomId").toString(); //! 여기서 roomId를 못받아서 116번쨰에서 null exception이 뜸 왜?????????????????????????????
        logger.info("[joinRoom] : roomId is " + roomId);
        String userId = roomJson.get("userId").toString();
        String password = roomJson.get("password").toString();

        List<Room> target = roomRepo.findByRoomId(roomId);
        if(target.isEmpty()) {
            return "refresh";
        }
        logger.info("[joinRoom] : target is " + target);
        User user = userRepo.findByUserId(userId);

        System.out.println("!!!!!!!!!!!!!!!!!!!!" + user.getRoom());

        if(roomId == null || roomId.length() == 0 ||   // 널 처리
                password == null || password.length() == 0) {
            logger.info("잘못된 접근 입니다.");
            return "fail";
        } else {
            if(!target.get(0).getRoomPassword().equals(password)) { //! 얘가왜 null이 뜨지?
                System.out.println("패스워드가 틀립니다. 다시 입력해 주세요.");
                return "password fail"; //! 이거도 사실 faulure면 status가 200이아니니까 에러? 같은 다른 방식으로 리스폰스줘야함
            } else if(user.getRoom() != null) {
                logger.info("잘못된 접근 입니다. (이미 방에 접속되어 있습니다)");
                return "already exist";
            } else {
                logger.info("패스워드가 일치합니다. 방으로 입장합니다.");
//                target.get(0).add(user);
//                roomRepo.save(target.get(0)); //! 이렇게 save 까지 하면 foreign key, 즉 맵핑이 성립됨
                return "success";
            }
        }
    }

    // POST create room
    @PostMapping("/api/room")
    public Room createRoom(@RequestBody Map<String, Object> roomJson) {

        logger.info("createRoom enter");

        String roomIdValue = UUID.randomUUID().toString();
        String roomTitle = roomJson.get("roomTitle").toString();
        String roomPassword = roomJson.get("roomPassword").toString();
        String roomHostId = roomJson.get("roomHostId").toString();
        User host = userRepo.findByUserId(roomHostId);
        if(host.getRoom() != null) {
            logger.info("잘못된 접근 입니다. (이미 호스트로서 방에 접속되어 있습니다.)");
//            throw new AccessDeniedException("권한이 없습니다.");
            return null;
        }
        Room newRoom = new Room(roomTitle, roomIdValue, roomPassword, roomHostId, host.getUsername(), true);
//        newRoom.add(host);

        logger.info("create new room");

        return roomRepo.save(newRoom);
    }

    @GetMapping("/api/live/{roomId}")
    @ResponseBody
    public Map<String, Object> roomInfoUser(@PathVariable("roomId") String roomId,
                                            @RequestParam String userId) {
        List<Room> newRoom = roomRepo.findByRoomId(roomId);
        User newUser = userRepo.findByUserId(userId);

        newRoom.get(0).add(newUser);
        roomRepo.save(newRoom.get(0));

        Map<String, Object> json = new HashMap<>();
        json.put("roomTitle", newRoom.get(0).getRoomTitle());
        json.put("username", newUser.getUsername());
        json.put("userImage",newUser.getProfileImage());
        json.put("roomHostId", newRoom.get(0).getRoomHostId());
        return json;
    }

//    @GetMapping("/api/live/{roomId}/users")
//    @ResponseBody
//    public List<Map<String, Object>> roomInfoUsers(@PathVariable("roomId") String roomId) {
//        List<Room> newRoom = roomRepo.findByRoomId(roomId);
//        Long roomPk = newRoom.get(0).getRoomPk();
//
//        List<User> newUserList = userRepo.findByRoom_RoomPk(roomPk);
//        List<Map<String, Object>> UserList = new ArrayList<>();
//
//        for (int i = 0; i < newUserList.size(); i++) {
//            Map<String, Object> map = new HashMap<>();
//            map.put("username", newUserList.get(i).getUsername());
//            map.put("userId", newUserList.get(i).getUserId());
//            map.put("userImage", newUserList.get(i).getProfileImage());
//            UserList.add(map);
//        }
//        return UserList;
//    }


    @PostMapping("api/live/{roomId}/inactive")
    public void isInactiveRoom(@PathVariable String roomId,
                               @RequestBody String newRoomId) {
        System.out.println("------------> newRoomId: " + newRoomId);
//        System.out.println("------------> roomId: " + roomId);
        List<Room> newRoom = roomRepo.findByRoomId(roomId);
        newRoom.get(0).setRoomActive(false);
        roomRepo.save(newRoom.get(0));
    }

    @PostMapping("/api/{roomId}/disconnect")
    public void deleteUser(@PathVariable("roomId") String roomId,
                           @RequestBody Map<String, Object> req) {
//        System.out.println("-------------------->여기로 들어오는가?!?!?!?");
        String userId = req.get("userId").toString();
        logger.info("user id is : " + userId);
        User user = userRepo.findByUserId(userId);
        user.setRoom(null);
        userRepo.save(user);

        List<Room> newRoom = roomRepo.findByRoomId(roomId);
        Long roomPk = newRoom.get(0).getRoomPk();

        List<User> newUserList = userRepo.findByRoom_RoomPk(roomPk);

        logger.info("현재 방에 존재하는 사람의 수 : " + newUserList.size());
        if ( newUserList.size() == 0) {
            roomRepo.delete(newRoom.get(0));
        }
    }


    @DeleteMapping("/api/room")
    public void deleteRoom(@RequestParam String uuid) {
        List<Room> newRoom = new ArrayList<>();
        roomRepo.delete(newRoom.get(0));
    }
}