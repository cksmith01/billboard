package com.cks.billboard.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.cks.billboard.util.Dates;
import org.springframework.web.bind.annotation.*;

import com.cks.billboard.UsageInfo;
import com.cks.billboard.model.SessionDate;
import com.cks.billboard.model.SysUser;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/info")
@CrossOrigin
public class InfoController {
	
	@GetMapping("/users")
	public List<SysUser> getUsers() {
		List<SysUser> _list = new ArrayList<SysUser>();

		Map<String, String> list = UsageInfo.getInstance().getUsers();
		list.forEach((key, value) -> {
			SysUser su = new SysUser();
			su.setIp(key);
			su.setDate(value);
			_list.add(su);
		});

		return _list;

	}

	@GetMapping("/cacheClearDate")
	public Date getCacheClearDate() {
		Date clearDate = UsageInfo.getInstance().getCacheCleardDate();
		return clearDate;
	}

	@GetMapping("/tag/{tag}/")
	public String tag(HttpServletRequest request, @PathVariable String tag) {
		String userIp = request.getRemoteAddr();
		UsageInfo.getInstance().addTag(userIp, tag);
		
		return userIp + "[" + tag + "]";
	}
	
	@GetMapping("/session/dates/{year}")
	public List<SessionDate> sessionDates(@PathVariable Integer year) {

//		return queryDao.getSessionStartAndEndDates(year);

		return List.of(new SessionDate("0", Dates.formatDBShort(null)));
	}

}
