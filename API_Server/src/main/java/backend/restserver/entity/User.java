package backend.restserver.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@Entity
@Table(name = "user")
@NoArgsConstructor
public class User {
    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="userPk")
    private Long userPk;
    @Column(name="username")
    private String username;
    @Column(name="password")
    private String password;
    @Column(name="email")
    private String email;
    @Column(name="roles")
    private String roles; //ROLE_USER, ROLE_ADMIN, ROLE_MANAGER

    public List<String> getRoleList() {
        if(this.roles.length() > 0) {
            return Arrays.asList(this.roles.split(","));
        }
        return new ArrayList<>();
    }

//    private Timestamp loginDate; // 얘는 로그인할때마다 저장된다. 근데 지금은 안한다. (1년뒤 만료되는거를 고려하기위해 넣어줌)

    private String provider;
    private String providerId;


    @CreationTimestamp
    private Timestamp createDate;

    @UpdateTimestamp
    private Timestamp updateDate;


//    @OneToOne(mappedBy = "user")
//    private Room room;\
    @ManyToOne
    @JoinColumn(name = "roomPk")
    private Room room;

//    public User() {}

    public User(String username) {
        this.username = username;
    }

    public User(String username, Room room) {
        this.username = username;
        this.room = room;
    }

    @Builder
    public User(String username, String password, String email, String roles, String provider, String providerId, Timestamp createDate) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.provider = provider;
        this.providerId = providerId;
        this.createDate = createDate;
    }

    //    public User(String name, Room room) {
//        this.name = name;
//        this.room = room;
//    }
}

