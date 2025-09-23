package com.cks.billboard.service;

import com.cks.billboard.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

@Service
public class BillService {

	private Logger logger = Logger.getLogger(this.getClass().getName());
	private boolean debug;

	@Autowired
	DataCache dataCache;

//	@Autowired
//	QueryDao queryDao;
	
	public Collection<BillItem> getBillList(Integer year) {

		Collection<BillItem> list = null;
		
//		if (year < 2025) {
//			list = queryDao.getBillsFor2024(year);
//		} else {
//			list = queryDao.getBillsFor2025(year);
//		}
		
		return list;
		
//		TreeMap<String, BillItem> filteredList = new TreeMap<String, BillItem>();
//
//		int dupes = 0;
//		int missing = 0;
//
//		for (Iterator<BillItem> iterator = list.iterator(); iterator.hasNext();) {
//			BillItem bill = (BillItem) iterator.next();
//
//			if (!filteredList.containsKey(bill.getBillNumber())) {
//				boolean add = true;
//				if (add && Strings.isBlank(bill.getActionCode())) {
//					add = false;
//					missing++;
//					LastAction last = queryDao.getLastAction(bill.getSessionID(), bill.getBillNumber());
//					if (last != null) {
//						add = true;
//						bill.setActionCode(last.getActionCode());
//						bill.setActionCodeDesc(last.getDescription());
//						bill.setActionDesc(last.getLocation());
//						bill.setLastActionDate(last.getActionDate());
//					} else {
////						logger.info("Ignored: " + bill.getBillNumber()+" it doesn't have a last action");
//					}
//				}
//
//				if (add)
//					filteredList.put(bill.getBillNumber(), bill);
//
//			} else {
//				dupes++;
//			}
//
//		}
//
//		if (debug) {
//			logger.info("Total: " + list.size() + " Duplicates: " + dupes + " Missing actions: " + missing);
//		}

//		return filteredList.values();
	}
	
	public List<ListItem> getCalendarList() {

//		return queryDao.getCalendarList();

		return null;
	}
	
	public List<ReadingCalItem> getCalendarBillOrder(Integer year) {

//		return queryDao.getCalendarBillOrder(year);
		return new ArrayList<ReadingCalItem>();
	}

	public Collection<ActionCode> getActiveActionCodes(Integer year) {
		return null;
	}

	public Collection<ActionOwnerCode> getActionAndOwnerCodes() {
		return null;
	}

	public List<Committee> getCommitteeList(Integer year) {
		return null;
	}
	
}
