package com.cks.billboard.controller;

import java.util.Calendar;
import java.util.Collection;
import java.util.List;

import com.cks.billboard.model.*;
import com.cks.billboard.model.json.StandingCommittee;
import com.cks.billboard.service.DataCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.cks.billboard.service.BillService;

@RestController
@RequestMapping("/api/v1/bill")
@CrossOrigin
public class BillsController {

	@Autowired
	BillService billService;

	@Autowired
	DataCache dataCache;

//	@GetMapping("/list/{year}")
//	public Collection<BillItem> billList(@PathVariable Integer year) {
//		/* todo:
//		 * 	this returns no data for 2021, and a few years back.  There is a gap in Sessions.DocMasterGlobal (or maybe DocMasterMemo)
//		 * 	that I think needs to be fixed at some point. Consider, writing a different query for previous years
//		 */
//		return billService.getBillList(year);
//	}

	@GetMapping("/list/{year}")
	public List<Bill> billList(@PathVariable Integer year) {
		/* todo:
		 * 	this returns no data for 2021, and a few years back.  There is a gap in Sessions.DocMasterGlobal (or maybe DocMasterMemo)
		 * 	that I think needs to be fixed at some point. Consider, writing a different query for previous years
		 */

		return dataCache.getBillList();
	}

	@GetMapping("/actionCodes/{year}")
	public Collection<ActionCode> actionCodes(@PathVariable Integer year) {
		return billService.getActiveActionCodes(year);
	}
	@GetMapping("/actionAndOwnerCodes/")
	public List<LegislativeCode> actionAndOwnerCodes() {
		return dataCache.getActionAndWwnerCodes();
	}

	@GetMapping("/committee/list/{year}")
	public List<StandingCommittee> commmitteeList(@PathVariable Integer year) {
		return dataCache.getStandingCommittees();
	}
	
	@GetMapping("/calendar/list/")
	public List<ListItem> calendarList() {
		return billService.getCalendarList();
	}
	
	@GetMapping("/calendar/bill/order/")
	public List<ReadingCalItem> calendarBillOrder() {
		Integer year = Calendar.getInstance().get(Calendar.YEAR);
		return billService.getCalendarBillOrder(year);
	}
	
}
