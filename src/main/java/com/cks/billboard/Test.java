package com.cks.billboard;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

public class Test {

    public static void main(String[] args) {

        try {

            System.out.println(Test.cleanSponsor("Sen. Balderree, Heidi"));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static String cleanSponsor(String sponsor) {
        if (sponsor != null && sponsor.startsWith("Sen.") || sponsor.startsWith("Rep.")) {
            return sponsor.substring(sponsor.indexOf(" ")+1);
        }
        return sponsor;
    }


}
