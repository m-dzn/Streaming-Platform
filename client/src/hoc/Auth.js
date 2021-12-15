import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../_actions/user_action";

export default function Auth(SpecificComponent, option, adminRoute = null) {
    // null   =>  아무나 출입 가능한 페이지
    // true   =>  로그인한 유저만 출입 가능한 페이지
    // false  =>  로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {
        const navigate = useNavigate();
        const dispatch = useDispatch();

        const user = useSelector((state) => state.user);

        useEffect(() => {
            dispatch(auth()).then((response) => {
                // 로그인하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) {
                        navigate("/login");
                    }
                } else {
                    // 로그인 한 상태
                    if (
                        option === false ||
                        (adminRoute && !response.payload.isAdmin)
                    ) {
                        navigate("/");
                    }
                }
            });
        }, []);

        return <SpecificComponent {...props} user={user} />;
    }

    return <AuthenticationCheck />;
}
