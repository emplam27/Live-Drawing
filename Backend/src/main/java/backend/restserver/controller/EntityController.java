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
    static int randBound = 10000;
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
    @GetMapping("/")
    public @ResponseBody List<Room> showRoomList(HttpSession session, HttpServletRequest httpServletRequest) {
        logger.info("show room list");
        logger.info(session.getId());

        String session_name = "";
        String session_value= "";

        Enumeration enum_01 = session.getAttributeNames();
        int i = 0;
        while(enum_01.hasMoreElements()) {
            i++;
            session_name = enum_01.nextElement().toString();
            session_value = session.getAttribute(session_name).toString();
            System.out.println("SESSION NAME[ " + session_name +" ] SESSION VALUE [ " + session_value + " ]");
        }
        System.out.println(i);

//        if(principalDetails != null) {
//            System.out.println("principalDetails : " + principalDetails.getUser());
//        } else {
//            System.out.println("로그인 이 필요합니다.");
//        }
//        RoomList list = new RoomList();
//        RoomList list = (RoomList) roomRepo.findAll();
//        return list;

//        User user = (User) httpSession.getAttribute("user");
//        System.out.println(user.getUsername());

//        System.out.println("---------->터지냐?1");
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        System.out.println("---------->터지냐?2");
//        User user = (User)authentication.getPrincipal();
//        System.out.println("---------->터지냐?3");

//        System.out.println(user);
//        String username = user.getUsername();
//        System.out.println(username);

//        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(SecurityContextHolder.getContext().getAuthentication().getPrincipal());
//        if(user!=null) {
//            System.out.println(user.getUser());
//        }


        return roomRepo.findAll();
    }


//    @GetMapping("/room/{id}")
//    public  giveUserInfo() {
//
//    }


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


//    // POST user info
//    @PostMapping("/save")
//    public Member saveMemberInfo(@RequestParam String name) {
//        logger.info("save user name : " + name);
//
//        return memberRepo.save(new Member(name));
//    }

    @PostMapping("/room/entrance")
    public void joinRoom(@RequestBody Map<String, Object> roomJson) {
        logger.info("join Room1!");
        String uuid = roomJson.get("roomKey").toString();
        logger.info("join Room2!");
//        Long roomPk = Long.valueOf()
        Long roomPk = Long.parseLong(roomJson.get("roomPk").toString());
//        Long roomPk = ((Number) roomJson.get("room_pk")).longValue();
        logger.info("join Room3!");

        if(uuid == null || uuid.length() == 0 || roomPk == 0) {
            return; // 널 처리
        } else {
            logger.info(" uuid is : " + uuid);

        Random rand = new Random();
        long randVal = (long) rand.nextInt(randBound);
        String userVal = Integer.toString((int) randVal);
        String userName = "Kim" + userVal;

        User newUser = new User(userName);
        newUser.setUserPk(roomPk);
        Optional<Room> target = roomRepo.findById(roomPk);
        target.get().add(newUser);

        userRepo.save(newUser);
//            List<Member> members = new ArrayList<>();
//            members.add(tmp);


//        Room target = roomRepo.findById(room_pk).get();
//        target.setMembers(members);
//        target.add(tmp);
//        roomRepo.save(target);


//        Room newRoom = new Room(roomTitle, keyValue, memberName, members);
//        newRoom.add(tmp);
        }
    }

    // POST create room
    @PostMapping("/room")
    public Room createRoom(@RequestBody Map<String, Object> roomJson) {
        Random rand = new Random();

        logger.info("createRoom enter");
        logger.info("------------->is here? 1");
//        long userId = (long)Integer.parseInt(userJson.get("id").toString());
//        User target = userRepo.findById(userId).get();

//        long keyValue = (long)rand.nextInt(randBound);
        String roomKeyValue = UUID.randomUUID().toString();
        logger.info("------------->is here? 2");
//        String keyValue = "1234안녕";
        String roomTitle = roomJson.get("roomTitle").toString();
        logger.info("------------->is here? 3");
//        logger.info("is here?1");
        String userName = roomJson.get("username").toString();
        logger.info("------------->is here? 4");
//        String hostName = memberJson.get("room_host").toString();
        logger.info("room name : " + roomTitle + " host name : " + userName);

        User tmp = new User(userName);
        userRepo.save(tmp);

//        List<Member> members = new ArrayList<>();
//        members.add(tmp);
//        Room newRoom = new Room(roomTitle, keyValue, memberName, members);
        Room newRoom = new Room(roomTitle, roomKeyValue, userName);
        newRoom.add(tmp);

        logger.info("create new room");

        return roomRepo.save(newRoom);
    }

    // GET get host info
    @GetMapping("/check")
    public void checkHost(@RequestParam Long id) {
//        logger.info("check host info");
//        logger.info("param id " + id);

        Room target = roomRepo.findById(id).get();
//        logger.info(target.getUser().getName());
    }
}