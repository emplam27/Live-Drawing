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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roomPk") //Camel 표기법이 db에서 반영안되는듯;
    private Long roomPk;

    @Column(name = "roomTitle")
    private String roomTitle;

    @Column(name = "roomKey")
    private String roomKey;

    @Column(name = "roomPassword")
    private String roomPassword;

    @Column(name = "roomHost")
    private String roomHost;

//    @OneToMany(mappedBy = "room")
//    private List<Member> members = new ArrayList<>();

//    public Room() {}

    public Room(String roomTitle, String roomKey, String roomHost) {
        this.roomTitle = roomTitle;
        this.roomKey = roomKey;
        this.roomHost = roomHost;
//        this.members = members;
    }

    public Room(String roomTitle, String roomKey, String roomPassword, String roomHost) {
        this.roomTitle = roomTitle;
        this.roomKey = roomKey;
        this.roomPassword = roomPassword;
        this.roomHost = roomHost;
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
