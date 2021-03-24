package backend.restserver.repository;

import backend.restserver.entity.Member;
import backend.restserver.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByRoom_RoomPk(Long roomPk);
}
