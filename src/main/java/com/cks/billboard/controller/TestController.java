package com.cks.billboard.controller;

import com.cks.billboard.job.JsonLoader;
import com.cks.billboard.model.Bill;
import com.cks.billboard.service.DataCache;
import com.cks.billboard.tool.MyBatisTableMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    MyBatisTableMapper myBatisTableMapper;

    @Autowired
    DataCache dataCache;

    @Autowired
    JsonLoader jsonLoader;

    @GetMapping("/")
    public String getOptions() throws IOException {
		return "not implemented";
    }

    @GetMapping("/currentUser")
    public String currentUser() {
        return "not implemented";
    }

    @GetMapping("/build/{tableName}/{pkColumn}")
    public String build(@PathVariable String tableName, @PathVariable String pkColumn) {
        myBatisTableMapper.buildPojoAndDao(tableName, pkColumn);
        return "done: " + tableName;
    }

    @GetMapping("/bills")
    public List<Bill> getBills() throws IOException {
        return dataCache.getBillList();
    }


}
