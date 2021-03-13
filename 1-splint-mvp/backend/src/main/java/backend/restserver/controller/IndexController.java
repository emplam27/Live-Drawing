package backend.restserver.controller;

import backend.restserver.list.RoomList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class IndexController {
    private final Logger logger = LoggerFactory.getLogger(IndexController.class);

    /*
    방 목록 ====> 실시간 드로잉 방
    Draw UI, 초대링크, 사용자목록, 음성-영상-채팅
     */

    // GET
    // 리스트 목록 조회
    @GetMapping("/list")
    @ResponseBody
    public RoomList showList() {
        logger.info("show room list");
        RoomList list = new RoomList();
        list.setTitle("load room list");
        return list;
    }

    // 입장
    @GetMapping("list/{id}")
    public String enter(@RequestParam("name") String name, @PathVariable Long id, Model model) {
        logger.info("path var : " + id);
        logger.info("request param : " + name);
        logger.info("check model : " + model.toString());

        model.addAttribute("name", name);
        String tmp = model.toString();
        logger.info("check model : " + tmp);

        return "room";
    }

    // POST
    // DELETE
}
