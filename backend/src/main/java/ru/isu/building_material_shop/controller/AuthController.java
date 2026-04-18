package ru.isu.building_material_shop.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isu.building_material_shop.model.Cart;
import ru.isu.building_material_shop.model.JwtResponse;
import ru.isu.building_material_shop.model.User;
import ru.isu.building_material_shop.payload.request.LoginRequest;
import ru.isu.building_material_shop.payload.request.SignupRequest;
import ru.isu.building_material_shop.payload.response.MessageResponse;
import ru.isu.building_material_shop.repository.CartRepository;
import ru.isu.building_material_shop.repository.UserRepository;
import ru.isu.building_material_shop.security.jwt.JwtUtils;
import ru.isu.building_material_shop.security.services.UserDetailsImpl;


//for Angular Client (withCredentials)
//@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials="true")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;
  
  @Autowired
  CartRepository cartRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
       User user = userRepository.findByUsername(loginRequest.getUsername());
      
        if (user == null || !encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Неверно введенный логин и/или пароль"));
        }
        
        Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getUsername(), 
                                loginRequest.getPassword()
                        )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String role = userDetails.getRole();

        return ResponseEntity.ok(
                new JwtResponse(
                        jwt,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        role
                )
        );
    }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Пользователь с данным логином существует"));
    }

    // Создаем нового пользователя
    User user = new User(
      signUpRequest.getUsername(),
      encoder.encode(signUpRequest.getPassword())
    );

    String strRole = signUpRequest.getRole();
    user.setRole(strRole);
    userRepository.save(user);

    // Создаем корзину для пользователя
    Cart cart = new Cart();
    cart.setUser(user); // Связываем корзину с пользователем
    cartRepository.save(cart); // Сохраняем корзину в базе данных

    return ResponseEntity.ok(new MessageResponse("Пользователь и корзина успешно зарегистрированы"));
  }
}
