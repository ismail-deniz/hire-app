package com.isoobss.project.config;

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

@Component
public class CustomLdapAuthoritiesPopulator implements LdapAuthoritiesPopulator {

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData, String username) {
        String employeeType = userData.getStringAttribute("employeeType");

        // Check if the employeeType is "HR" and return the appropriate role
        if ("HR".equalsIgnoreCase(employeeType)) {
            return Collections.singletonList(() -> "ROLE_HR");
        }

        // Return default roles if employeeType is not "HR"
        // You can customize this based on your requirements
        return Collections.emptyList();
    }
}
