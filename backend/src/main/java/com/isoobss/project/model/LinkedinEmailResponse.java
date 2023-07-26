package com.isoobss.project.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LinkedinEmailResponse {
    private EmailElement[] elements;

    public EmailElement[] getElements() {
        return elements;
    }

    public void setElements(EmailElement[] elements) {
        this.elements = elements;
    }

    public static class EmailElement {
        @JsonProperty("handle~")
        private EmailHandle handle;

        public EmailHandle getHandle() {
            return handle;
        }

        public void setHandle(EmailHandle handle) {
            this.handle = handle;
        }
    }

    public static class EmailHandle {
        private String emailAddress;

        public String getEmailAddress() {
            return emailAddress;
        }

        public void setEmailAddress(String emailAddress) {
            this.emailAddress = emailAddress;
        }
    }
}
