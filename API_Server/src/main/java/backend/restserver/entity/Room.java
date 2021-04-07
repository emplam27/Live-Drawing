package backend.restserver.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Data
@Entity
@Table(name = "room")
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue()
    @Column(name = "roomPk") //Camel 표기법이 db에서 반영안되는듯;
    private Long roomPk;

    @Column(name = "roomTitle")
    private String roomTitle;

    @Column(name = "roomId")
    private String roomId; // uuid

    @Column(name = "roomHostname")
    private String roomHostname;

    @Column(name = "roomPassword")
    private String roomPassword;

    @Column(name = "roomHostId")
    private String roomHostId;

//    @OneToMany(mappedBy = "room")
//    private List<Member> members = new ArrayList<>();

//    public Room() {}

    public Room(String roomTitle, String roomId, String roomHostId) {
        this.roomTitle = roomTitle;
        this.roomId = roomId;
        this.roomHostId = roomHostId;
//        this.members = members;
    }

    public Room(String roomTitle, String roomId, String roomPassword, String roomHostId, String roomHostname) {
        this.roomTitle = roomTitle;
        this.roomId = roomId;
        this.roomPassword = roomPassword;
        this.roomHostId = roomHostId;
        this.roomHostname = roomHostname;
    }

    public void add(User user) {
        user.setRoom(this);
//        getMembers().add(member);
    }

    //    public Room(String room_title, String room_key, List<Member> members) {
//        this.room_title = room_title;
//        this.room_key = room_key;
//        this.members = members;
//    }
}
