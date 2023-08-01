package com.isoobss.project.service;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.model.Hr;
import com.isoobss.project.model.Opening;
import com.isoobss.project.repository.HrRepository;

@Service
public class HrService {
    private final HrRepository hrRepository;

    @Autowired
    public HrService(HrRepository hrRepository) {
        this.hrRepository = hrRepository;
    }

    public ObjectId getHrByUsername(String username) {
        Hr hr = hrRepository.findByUsername(username);
        
        if (hr == null) {
            hr = createHr(username);
        }

        return hr.getId();
    }

    private Hr createHr(String username) {
        Hr hr = new Hr();
        hr.setUsername(username);
        hr.setOpenings(new ArrayList<Opening>());

        return hrRepository.save(hr);
    }

}
