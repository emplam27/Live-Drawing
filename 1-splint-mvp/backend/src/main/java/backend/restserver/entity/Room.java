package backend.restserver.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue
    @Column(name = "room_pk") //Camel 표기법이 db에서 반영안되는듯;
    private Long roomPk;

    @Column(name = "room_title")
    private String roomTitle;

    @Column(name = "room_key")
    private String roomKey;

    @Column(name = "room_host")
    private String roomHost;

//    @OneToMany(mappedBy = "room")
//    private List<Member> members = new ArrayList<>();

    public Room() {}

    public Room(String roomTitle, String roomKey, String roomHost) {
        this.roomTitle = roomTitle;
        this.roomKey = roomKey;
        this.roomHost = roomHost;
//        this.members = members;
    }


    public void add(Member member) {
        member.setRoom(this);
//        getMembers().add(member);
    }

    //    public Room(String room_title, String room_key, List<Member> members) {
//        this.room_title = room_title;
//        this.room_key = room_key;
//        this.members = members;
//    }
}
