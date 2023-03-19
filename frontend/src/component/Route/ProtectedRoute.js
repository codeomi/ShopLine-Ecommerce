import React, { Component, Fragment } from 'react'
import {Navigate, Route} from "react-router-dom"
import {useSelector} from "react-redux"

const ProtectedRoute = ({isAdmin,component=Component, ...rest}) => {
    const {isAuthenticated, loading, user} = useSelector(state=>state.user)
  return (
    <Fragment>
        {loading ===false && (<Route
            {...rest}
            render={(props)=>{
                if(isAuthenticated===false){
                    return <Navigate to="/login"></Navigate>
                }
                if(isAdmin===true && user.role!== "admin"){
                    return <Navigate to ="/login"/>
                }
                return <Component {...props}/>
            }}
        />)}
    </Fragment>
  )
}

export default ProtectedRoute