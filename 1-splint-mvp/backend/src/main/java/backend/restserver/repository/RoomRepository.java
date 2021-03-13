package backend.restserver.repository;

import backend.restserver.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.reflect.Member;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
