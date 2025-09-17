package com.cks.billboard.dao;

import com.cks.billboard.model.EventLog;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EventLogDao {
    final String SELECT = """
            SELECT
            	event_id AS eventId,
            	event_date AS eventDate,
            	event_type AS eventType,
            	event_desc AS eventDesc,
            	duration_seconds as durationSeconds
            FROM event_log
            """;

    @Select(SELECT)
    List<EventLog> getAllEventLogs();

    @Select(SELECT + " WHERE event_id = #{eventId}")
    EventLog getEventLogById(@Param("eventId") Integer eventId);

    final String INSERT = """
            INSERT INTO event_log (
            	event_id,
            	event_date,
            	event_type,
            	event_desc,
            	duration_seconds
            ) VALUES (
            	#{eventId, jdbcType=NUMERIC}, 
            	#{eventDate, jdbcType=VARCHAR}, 
            	#{eventType, jdbcType=VARCHAR}, 
            	#{eventDesc, jdbcType=VARCHAR},
            	#{durationSeconds, jdbcType=NUMERIC}
            );
            """;

    @Options(useGeneratedKeys = true, keyProperty = "eventId", keyColumn = "event_id")
    @Insert(INSERT)
    Integer insertEventLog(EventLog eventLog);

    final String UPDATE = """
            UPDATE event_log SET
             	event_date = #{eventDate, jdbcType=VARCHAR}, 
            	event_type = #{eventType, jdbcType=VARCHAR}, 
            	event_desc = #{eventDesc, jdbcType=VARCHAR},
            	duration_seconds = #{durationSeconds, jdbcType=NUMERIC}
             WHERE event_id = #{eventId, jdbcType=NUMERIC};
            """;

    @Update(UPDATE)
    Integer updateEventLog(EventLog eventLog);

    final String DELETE = """
            	DELETE FROM event_log WHERE event_id = #{eventId,jdbcType=NUMERIC};
            """;

    @Delete(DELETE)
    Integer deleteEventLog(@Param("eventId") Integer eventId);

    /**
     * Date formats should be: yyyy-MM-dd
     * @param startDate
     * @param endDate
     * @return
     */
    @Select(SELECT + " WHERE event_date BETWEEN #{startDate} AND #{endDate}")
    List<EventLog> getEventLogByRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

}
