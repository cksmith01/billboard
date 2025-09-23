package com.cks.billboard.config;

import com.cks.billboard.service.DataCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.StringTokenizer;
import java.util.logging.Logger;

/**
 * @author CKSmith
 */

@Component
@Order(1)
public class SqliteInitializer implements CommandLineRunner {

    private Logger logger = Logger.getLogger(getClass().getName());

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    DataCache dataCache;

    @Value("${data.dir}")
    String dataDir;

    public SqliteInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {

        String dbFileName = "billboard.db";
        String dbPath = dataDir + dbFileName;
        File dbFile = new File(dbPath);

        if (dbFile.exists()) {
            logger.info("Sqlite database (" + dbFileName + ") already exists!");
        } else {
            logger.info("Creating Sqlite database file (" + dbFileName + ") ...");

            File dataFolder = new File(dataDir);
            if (!dataFolder.exists()) {
                dataFolder.mkdirs();
            }

            if (dbFile.createNewFile()) {
                logger.info(dbFile.getPath() + " created! Building schema...");
                StringTokenizer statements = new StringTokenizer(SCHEMA, "\n");
                while (statements.hasMoreElements()) {
                    jdbcTemplate.execute(statements.nextToken());
                }
                logger.info("Sqlite database schema created!");
            } else {
                throw new RuntimeException("could not create database file: " + dbFile.getAbsolutePath());
            }
        }

        /*
        Todo:
            maybe take another run at calling this using spring events but
            everything I tried to add to the DataCache didn't work including ...
                @DependsOn("sqliteInitializer")
                @PostConstruct ... on the init method
                @EventListener
                public void onApplicationEvent(ContextRefreshedEvent event) {}
                @EventListener
                public void handleContextRefreshEvent(ContextStartedEvent ctxStartEvt) {}
         */
        dataCache.init();

        logger.info("Sqlite initializer completed!");
    }

    private static final String SCHEMA = """
            CREATE TABLE event_log (event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_date DATETIME DEFAULT CURRENT_TIMESTAMP, event_type TEXT NOT NULL, event_desc TEXT NOT NULL, duration_seconds REAL);
            INSERT INTO event_log (event_date, event_type, event_desc, duration_seconds) VALUES (datetime('now'), 'SQLiteInitializer', 'Database creation', '0.0');
            """;
}
