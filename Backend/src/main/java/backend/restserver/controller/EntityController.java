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
    @GetMapping("/api")
    public @ResponseBody List<Room> showRoomList() {
        logger.info("show room list");



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
//        List<Room> roomList = roomRepo.findAll();

//        List<Room> findRoomList = roomRepo.findAllOrderByRoomPk(1L);
//        System.out.println("iiiiiiiiiiiiiiiiiii" + findRoomList);
        List<Room> findRoomList = roomRepo.findAll();
        System.out.println("iiiiiiiiiiiiiiiiiii" + findRoomList);
        System.out.println("---------------->1<--------------");
        List<Room> selectRoomList = new ArrayList<>();

        System.out.println("---------------->2<--------------");

        for(int i = 0; i < findRoomList.size(); i++) {
            System.out.println("---------------->3<--------------");
            if(i == 4) break;
            selectRoomList.add(findRoomList.get(i));
        }
        System.out.println("---------------->4<--------------");
        return selectRoomList;
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

    @PostMapping("/api/room/entrance")
    public String joinRoom(@RequestBody Map<String, Object> roomJson) {
        System.out.println("----------------->너냐1?");
        String uuid = roomJson.get("roomKey").toString();
        System.out.println("----------------->너냐2?");
//        Long roomPk = Long.valueOf()
        Long roomPk = Long.parseLong(roomJson.get("roomPk").toString());
        System.out.println("----------------->너냐3?");
//        Long roomPk = ((Number) roomJson.get("room_pk")).longValue();
        System.out.println(roomJson.get("username").toString());
        String username = roomJson.get("username").toString();
        System.out.println("----------------->너냐4?");

        String password = roomJson.get("password").toString();
        System.out.println("----------------->응아냐?");
//        logger.info("------------->is here? 5");
        System.out.println("------------------->uuid :" + uuid);
        System.out.println("------------------->password" + password);

        if(uuid == null || uuid.length() == 0 || roomPk == 0 ||   // 널 처리
                password == null || password.length() == 0) {
            System.out.println("잘못된 접근 입니다.");
            return "failure";
        } else {
            logger.info(" uuid is : " + uuid);
            System.out.println("======================>roomPassword : " + password);
            Optional<Room> target = roomRepo.findById(roomPk);

            System.out.println("---------------------->??????? : " + target.get().getRoomPassword());
            if(target.get().getRoomPassword().equals(password)) {
                System.out.println("패스워드가 일치합니다. 방으로 입장합니다.");
                User user = userRepo.findByUsername((username));
                target.get().add(user);
                return "success";
            } else {
                System.out.println("패스워드가 틀립니다. 다시 입력해 주세요.");
                return "failure";
            }





//        Random rand = new Random();
//        long randVal = (long) rand.nextInt(randBound);
//        String userVal = Integer.toString((int) randVal);
//        String userName = "Kim" + userVal;

//        User newUser = new User(userName);
//        newUser.setUserPk(roomPk);

//            user.getRoom().setRoomPk(roomPk);

//        userRepo.save(newUser);
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
    @PostMapping("/api/room")
    public Room createRoom(@RequestBody Map<String, Object> roomJson) {
//        Random rand = new Random();

        logger.info("createRoom enter");
        System.out.println("------------> 니년 이름은? " + roomJson.get("roomHost"));
        System.out.println("------------> 방 이름은? " + roomJson.get("roomTitle"));
        System.out.println("------------> 방 비번은? " + roomJson.get("roomPassword"));

//        logger.info("------------->is here? 1");
//        long userId = (long)Integer.parseInt(userJson.get("id").toString());
//        User target = userRepo.findById(userId).get();

//        long keyValue = (long)rand.nextInt(randBound);
        String roomKeyValue = UUID.randomUUID().toString();
        logger.info("------------->is here? 2");
//        String keyValue = "1234안녕";
        String roomTitle = roomJson.get("roomTitle").toString();
        logger.info("------------->is here? 3");
//        logger.info("is here?1");
        String roomPassword = roomJson.get("roomPassword").toString();
        logger.info("------------->is here? 4");
        String roomHost = roomJson.get("roomHost").toString();
        logger.info("------------->is here? 5");
//        String hostName = memberJson.get("room_host").toString();
//        logger.info("room name : " + roomTitle + " host name : " + userName);

//        User tmp = new User(userName);
//        userRepo.save(tmp);

//        List<Member> members = new ArrayList<>();
//        members.add(tmp);
//        Room newRoom = new Room(roomTitle, keyValue, memberName, members);
        User host = userRepo.findByUsername(roomHost);
        logger.info("------------->is here? 6");
        Room newRoom = new Room(roomTitle, roomKeyValue, roomPassword, roomHost);
        logger.info("------------->is here? 7");
        newRoom.add(host);
        logger.info("------------->is here? 8");

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