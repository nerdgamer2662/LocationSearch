package com.cs3300.group8.locationsearch.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cs3300.group8.locationsearch.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);

    Boolean existsByUsername(String username);

}
