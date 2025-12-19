package com.cks.billboard;

import com.cks.billboard.job.JsonLoader;
import com.cks.billboard.model.Bill;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@SpringBootTest
class BillTest {

    @Autowired
    JsonLoader jsonLoader;

//    @Test
    void testAllBills() throws IOException {

        List<Bill> bills = jsonLoader.getBills();

        // if there is no data, we don't want to test it...
        if (bills.size() == 0) {
            return;
        }

        for (Bill bill : bills) {
            assert (bill.getSponsorID() != null);
            assert (bill.getPrimarySponsor() != null);
            assert (bill.getBillNumber() != null);
            assert (bill.getRealBillNumber() != null);
            assert (bill.getFileNumber() != null);
            assert (bill.getOwner() != null);
            assert (bill.getOwnerDesc() != null);
            assert (bill.getLastActionDate() != null);
            assert (bill.getLastActionCode() != null);
            assert (bill.getLastActionDesc() != null);
            assert (bill.getAttorney() != null);
            assert (bill.getLfaAnalyst() != null);
            assert (bill.getShortTitle() != null);
            assert (bill.getLongTitle() != null);
            assert (bill.getLink() != null);
            assert (bill.getTrackingId() != null);
            assert (bill.getUpdateTime() != null);

            if (bill.getFloorSponsorID() != null) {
                assert (bill.getFloorSponsor() != null);
            }

        }

    }

    @Test
    public void testSpecificBill() throws IOException {

        List<Bill> bills = jsonLoader.getBills();

        Optional<Bill> item = bills.stream().filter(i ->
                i.getBillNumber().equalsIgnoreCase("SB0333")).findFirst();

        item.ifPresent(System.out::println);

        item = bills.stream().filter(i ->
                i.getBillNumber().equalsIgnoreCase("SB0328")).findFirst();

        item.ifPresent(System.out::println);

    }

}
