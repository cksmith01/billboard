package com.cks.billboard;

import com.cks.billboard.job.JsonLoader;
import com.cks.billboard.model.Bill;
import com.cks.billboard.model.json.Legislator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;

@SpringBootTest
class LegislatorsTest {

    @Autowired
    JsonLoader jsonLoader;

    @Test
    void test() throws IOException {

        List<Legislator> legislators = jsonLoader.getLegislators();

        System.out.println("size: " + legislators.size());
        assert (legislators.size() == 104);

        legislators.forEach( legislator -> {
            if (legislator.id().equals("MOSSJ")) {
                System.out.println(legislator.toString());
            }
        });

        jsonLoader.getBills().forEach( bill -> {
            boolean hit = false;
            for (Legislator l : legislators) {
                if (l.id().equals(bill.getSponsorID())) {
                    hit = true;
                }
            }
            if (!hit) {
                System.out.println("couldn't find legislator for " + bill.getBillNumber() + " " + bill.getSponsorID());
            }
        });



    }

}
